from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from datetime import date

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by('-date', 'employee__full_name')
        date_param = self.request.query_params.get('date', None)
        employee_param = self.request.query_params.get('employee', None)
        
        if date_param:
            queryset = queryset.filter(date=date_param)
        if employee_param:
            queryset = queryset.filter(employee_id=employee_param)
            
        return queryset

@api_view(['GET'])
def dashboard_stats(request):
    total_employees = Employee.objects.count()
    
    date_param = request.query_params.get('date', None)
    if date_param:
        try:
            target_date = date.fromisoformat(date_param)
        except ValueError:
            target_date = date.today()
    else:
        target_date = date.today()
        
    present_today = Attendance.objects.filter(date=target_date, status='Present').count()
    absent_today = Attendance.objects.filter(date=target_date, status='Absent').count()
    
    return Response({
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "date": target_date.isoformat()
    })
