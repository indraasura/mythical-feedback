from rest_framework import serializers
from excel.models import ExcelFile


class ExcelFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExcelFile
        fields = ('excel_file', 'timestamp')
