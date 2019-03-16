from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ScriptBuilderSerializer


class ScriptFlowUploadView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.data)
        script_flow_serializer = ScriptBuilderSerializer(data=request.data)
        if script_flow_serializer.is_valid():
            script_flow_serializer.save()
            return Response(script_flow_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(script_flow_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# It's a function rather than an API view
class BuilderToPath(APIView):
    def post(self, request, *args, **kwargs):
        main_id = ''
        temp_json = {}
        filtered_data = {}
        final_list = []
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
