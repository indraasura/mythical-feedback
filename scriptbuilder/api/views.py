from rest_framework import status, generics
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ScriptBuilderSerializer, ScriptBuilderViewSerializer
from scriptbuilder.models import ScriptBuilder
from autocall.models import Survey


class ScriptJSONAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    """
    lookup_field = 'pk'
    permission_classes = ()
    serializer_class = ScriptBuilderSerializer

    def get_queryset(self):
        return ScriptBuilder.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        script_status, script_message, script_id = check_script_flow(request.data['script_flow'])
        if script_status:
            script_builder_model = request.data
            main_id = ''
            temp_json = {}
            filtered_data = {}
            final_list = []
            data = script_builder_model['script_flow']
            try:
                for i in data['nodes']:
                    filtered_data[i['id']] = {
                        'question': i['name'],
                        'record_time': i['extras']['record_time'],
                        'voice_gender': i['extras']['voice_gender']
                    }

                    # Check if we have Source node which have only 1 port with Out
                    if len(i['ports']) == 1 and i['ports'][0]['label'] == 'Out':
                        main_id = i['id']
                for i in data['links']:
                    temp_json[i['source']] = i['target']
                for i in range(len(temp_json) + 1):
                    final_list.append({
                        'id': main_id,
                        'question': filtered_data[main_id]['question'],
                        'record_time': filtered_data[main_id]['record_time'],
                        'voice_gender': filtered_data[main_id]['voice_gender']
                    })
                    main_id = temp_json[main_id] if main_id in temp_json else None
                final_data = {
                    'name': script_builder_model['name'],
                    'id': kwargs['pk'],
                    'data': final_list
                }
                self.perform_update(serializer)
                print('UPDATED')
                script = ScriptBuilder.objects.get(id=kwargs['pk'])
                print(script.id, script.script_flow)
                survey_model = Survey.objects.filter(script=script).update(script_flow=final_data)
            except:
                 script = ScriptBuilder.objects.get(id=script_builder_model['id'])
                 script.delete()
                 return Response({'status': 500, 'message': "JSON is not valid"})
            return Response({
                'id': kwargs['pk'],
                'script_status': True
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'script_status': script_status,
                'script_message': script_message,
                'script_id': script_id,
            }, status=status.HTTP_200_OK)



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


class ScriptFlowCheckView(APIView):
    """
    To check whether the given script is in working state or not
    """

    def post(self, request, *args, **kwargs):
        script_flow_serializer = ScriptBuilderSerializer(data=request.data)
        if script_flow_serializer.is_valid():
            script_builder_model = request.data
            script_status, script_message, script_id = check_script_flow(script_builder_model['script_flow'])
            return Response({
                'script_status': script_status,
                'script_message': script_message,
                'script_id': script_id,
            }, status=status.HTTP_200_OK)
        else:
            return Response(script_flow_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def check_script_flow(data):
    """
    :param data: Script Flow JSON objects with nodes and links
    :return:  True or False
    """
    # 0. Check if JSON is valid or not
    if 'nodes' not in data or 'links' not in data:
        return False, "Not a Valid JSON", None

    # 1. Check if there is more than 1 nodes
    if len(data['nodes']) < 2:
        return False, "There needs to be more than 1 nodes connected", None

    # 2. Check whether there is only 1 source or not
    temp = []
    for node in data['nodes']:
        temp.append(node['extras']['node_type'])
    if temp.count('out') > 1:
        return False, "There is more than one source node", None

    # 3. Check if there is only 1 end or not
    if temp.count('in') > 1:
        return False, "There is more than one end node", None

    # 4. With one port there can't be more than 1 link
    # TODO: This will be changed in v2.0.0 for numbering support with multiple input number
    temp = {}
    temp_nodes = set()
    for link in data['links']:
        if link['source'] in temp:
            return 'False', "There can't be any node links to more than 1 node", link['source']
        else:
            temp_nodes.add(link['source'])
            temp_nodes.add(link['target'])
            temp[link['source']] = link['target']

    # 5. Number of connected nodes is equal to the total nodes
    #    As if there is no single node present
    if len(data['nodes']) != len(temp_nodes):
        return False, "There can't be any loose node in the given flow", None

    # TODO: 6. Check Conditional operator

    # END: Everything is fine
    return True, "No problem", None


class ScriptFlowUploadView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.data)
        script_flow_serializer = ScriptBuilderSerializer(data=request.data)
        if script_flow_serializer.is_valid():
            script_status, script_message, script_id = check_script_flow(request.data['script_flow'])
            if script_status:
                script_flow_serializer.save()
                print(script_flow_serializer.data['id'])
                script_builder_model = script_flow_serializer.data
                main_id = ''
                temp_json = {}
                filtered_data = {}
                final_list = []
                data = script_builder_model['script_flow']
                try:
                    for i in data['nodes']:
                        filtered_data[i['id']] = {
                            'question': i['name'],
                            'record_time': i['extras']['record_time'],
                            'voice_gender': i['extras']['voice_gender']
                        }

                        # Check if we have Source node which have only 1 port with Out
                        if len(i['ports']) == 1 and i['ports'][0]['label'] == 'Out':
                            main_id = i['id']
                    for i in data['links']:
                        temp_json[i['source']] = i['target']
                    for i in range(len(temp_json) + 1):
                        final_list.append({
                            'id': main_id,
                            'question': filtered_data[main_id]['question'],
                            'record_time': filtered_data[main_id]['record_time'],
                            'voice_gender': filtered_data[main_id]['voice_gender']
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
                    'id': script_flow_serializer.data['id'],
                    'script_status': True
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'script_status': script_status,
                    'script_message': script_message,
                    'script_id': script_id,
                }, status=status.HTTP_200_OK)
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
