from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/index/$', consumers.Consumer.as_asgi()),
    re_path(r'ws/chat/$', consumers.QuizControlConsumer.as_asgi()),
    re_path(r'ws/result/$', consumers.ResultsConsumer.as_asgi()),
    re_path(r'ws/name/$', consumers.ChatConsumer.as_asgi()),

]