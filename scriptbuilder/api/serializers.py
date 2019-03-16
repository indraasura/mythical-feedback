from rest_framework import serializers
from scriptbuilder.models import ScriptBuilder
import json


# class JSONSerializerField(serializers.Field):
#     """Serializer for JSONField -- required to make field writable"""
#
#     def to_representation(self, value):
#         json_data = {}
#         try:
#             json_data = json.loads(value)
#         except ValueError as e:
#             raise e
#         finally:
#             return json_data
#
#     def to_internal_value(self, data):
#         return json.dumps(data)


class ScriptBuilderSerializer(serializers.ModelSerializer):
    script_flow = serializers.JSONField()

    class Meta:
        model = ScriptBuilder
        fields = ('name', 'script_flow', 'timestamp')
