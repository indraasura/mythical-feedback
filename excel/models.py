from django.db import models
from accounts.models import User


class ExcelFile(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    excel_file = models.FileField(blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)
