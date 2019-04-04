from django.conf.urls import url
from .api.views import ScriptFlowUploadView, ScriptFlowAPIView, BuilderToJson, ScriptJSONAPIView, ScriptFlowCheckView

urlpatterns = [
    url(r'^upload/$', ScriptFlowUploadView.as_view(), name='script-flow-upload'),
    url(r'^view/', ScriptFlowAPIView.as_view(), name='script-flow-get'),
    url(r'^get/$', BuilderToJson.as_view(), name='builder-to-json-view'),
    url(r'^getit/(?P<pk>\d+)', ScriptJSONAPIView.as_view(), name='script-json-response'),
    url(r'^check/', ScriptFlowCheckView.as_view(), name="script-flow-check")
]