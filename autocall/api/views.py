from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import ACCOUNT_SID, AUTH_TOKEN
from twilio.rest import Client


class MakeCallAPIView(APIView):
    client = Client(ACCOUNT_SID, AUTH_TOKEN)

    def post(self, request, *args, **kwargs):
        print(request.data)
        to_phonenumber = request.data['to_phonenumber']
        survey = request.data['survey']
        from_phonenumber = '+12019044102'
        call = self.client.calls.create(
            to=to_phonenumber,
            from_=from_phonenumber,
            url=url + "/answer"
        )

        return Response(excel_file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(excel_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
