from django.conf.urls import url
from .api.views import ExcelFileUploadView, ExcelFileView, ExcelFileAPIView

urlpatterns = [
    url(r'^upload/$', ExcelFileUploadView.as_view(), name='excel-file-upload'),
    url(r'^get/$', ExcelFileView.as_view(), name='excel-file-view'),
    url(r'^view/$', ExcelFileAPIView.as_view(), name='excel-file-view'),
]