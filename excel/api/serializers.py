from rest_framework import serializers
from excel.models import ExcelFile


class ExcelFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExcelFile
        fields = ('id', 'excel_file', 'timestamp')
