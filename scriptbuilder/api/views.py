from rest_framework import status, generics
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ScriptBuilderSerializer, ScriptBuilderViewSerializer
from scriptbuilder.models import ScriptBuilder
from autocall.models import Survey


class ScriptFlowAPIView(generics.ListCreateAPIView):
    """

    """
    serializer_class = ScriptBuilderViewSerializer
    permission_classes = ()
    filter_backends = [OrderingFilter]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        qs = ScriptBuilder.objects.all()
        return qs


class ScriptFlowUploadView(APIView):

    def post(self, request, *args, **kwargs):
        script_flow_serializer = ScriptBuilderSerializer(data=request.data)
        if script_flow_serializer.is_valid():
            script_flow_serializer.save()
            script_builder_model = script_flow_serializer.data
            main_id = ''
            temp_json = {}
            filtered_data = {}
            final_list = []
            data = script_builder_model['script_flow']
            try:
                for i in data['nodes']:
                    filtered_data[i['id']] = i['name']
                    if len(i['ports']) == 1 and i['ports'][0]['label'] == 'Out':
                        main_id = i['id']
                for i in data['links']:
                    temp_json[i['source']] = i['target']
                for i in range(len(temp_json) + 1):
                    final_list.append({
                        'id': main_id,
                        'question': filtered_data[main_id]
                    })
                    main_id = temp_json[main_id] if main_id in temp_json else None
                final_data = {
                    'name': script_builder_model['name'],
                    'id': script_builder_model['id'],
                    'data': final_list
                }
                script = ScriptBuilder.objects.get(id=script_builder_model['id'])
                survey_model = Survey.objects.create(script=script, script_flow=final_data)
                survey_model.save()
            except:
                script = ScriptBuilder.objects.get(id=script_builder_model['id'])
                script.delete()
                return Response({'status': 500, 'message': "JSON is not valid"})
            return Response({
                'id': survey_model.id
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(script_flow_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BuilderToJson(APIView):
    """
    View JSON format of build user has made
    """
    permission_classes = []

    def get(self, request):
        name = request.GET.get('name', '')
        script_id = request.GET.get('id', 0)

        try:
            script_builder_model = ScriptBuilder.objects.get(name=name, id=script_id)
        except ScriptBuilder.DoesNotExist:
            script_builder_model = None

        if script_builder_model:
            main_id = ''
            temp_json = {}
            filtered_data = {}
            final_list = []
            data = script_builder_model.script_flow
            try:
                for i in data['nodes']:
                    filtered_data[i['id']] = i['name']
                    if len(i['ports']) == 1 and i['ports'][0]['label'] == 'Out':
                        main_id = i['id']
                for i in data['links']:
                    temp_json[i['source']] = i['target']
                for i in range(len(temp_json) + 1):
                    final_list.append({
                        'id': main_id,
                        'question': filtered_data[main_id]
                    })
                    main_id = temp_json[main_id] if main_id in temp_json else None
                return Response({
                    'name': name,
                    'id': script_id,
                    'data': final_list
                })
            except:
                return Response({'status': 500, 'message': 'Internal Server Error, this may be caused due to bad JSON upload'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'status': 400, 'message': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
