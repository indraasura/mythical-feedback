from django.conf.urls import url
from .api.views import ExcelFileUploadView, ExcelFileView

urlpatterns = [
    url(r'^upload/$', ExcelFileUploadView.as_view(), name='excel-file-upload'),
    url(r'^get/$', ExcelFileView.as_view(), name='excel-file-view'),
]