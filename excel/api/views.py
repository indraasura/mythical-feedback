from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ExcelFileSerializer
from excel.models import ExcelFile

import xlrd
from django.conf import settings

media_root = settings.MEDIA_ROOT + '/'


class ExcelFileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print(request.data)
        excel_file_serializer = ExcelFileSerializer(data=request.data)
        if excel_file_serializer.is_valid():
            excel_file_serializer.save()
            return Response(excel_file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(excel_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExcelFileView(APIView):
    """
    View Excel file details based on filename and file_id
    """
    permission_classes = []

    def get(self, request):
        filename = request.GET.get('filename', '')
        file_id = request.GET.get('id', 0)

        try:
            file_model = ExcelFile.objects.get(excel_file=filename, id=file_id)
        except ExcelFile.DoesNotExist:
            file_model = None

        if file_model:
            wb = xlrd.open_workbook(media_root + file_model.excel_file.name)
            sheet = wb.sheet_by_index(0)
            json_data = {'filename': file_model.excel_file.name, 'heading': sheet.row_values(0), 'data': []}
            for i in range(1, sheet.nrows):
                temp = {}
                row_value = sheet.row_values(i)
                for j in range(len(row_value)):
                    temp[json_data['heading'][j]] = row_value[j]
                json_data['data'].append(temp)
            return Response(json_data)
        else:
            return Response({'status': 400, 'message': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
