from django.conf.urls import url
from .api.views import ScriptFlowUploadView, ScriptFlowAPIView, BuilderToJson

urlpatterns = [
    url(r'^upload/$', ScriptFlowUploadView.as_view(), name='script-flow-upload'),
    url(r'^view/', ScriptFlowAPIView.as_view(), name='script-flow-get'),
    url(r'^get/$', BuilderToJson.as_view(), name='builder-to-json-view')
]