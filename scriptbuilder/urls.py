from django.conf.urls import url
from .api.views import ScriptFlowUploadView

urlpatterns = [
    url(r'^upload/$', ScriptFlowUploadView.as_view(), name='script-flow-upload'),
]