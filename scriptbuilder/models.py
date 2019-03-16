from django.db import models
from accounts.models import User
from django.contrib.postgres.fields import JSONField


class ScriptBuilder(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=80, default='')
    script_flow = JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
