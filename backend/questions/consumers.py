import json
from channels.generic.websocket import AsyncWebsocketConsumer

class Consumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = "index_group"  # Global group for all clients
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()  # Accept WebSocket connection
        self.send(text_data="WebSocket connected!")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        index = data['index']  # Extract the new index from client

        # Broadcast the new index to all clients in group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'index_update',  # Will trigger index_update()
                'index': index
            }
        )

    async def index_update(self, event):
        index = event['index']
        await self.send(text_data=json.dumps({'index': index}))  # Send to React


class QuizControlConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("quiz_control_group", self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'Connected to quiz control'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("quiz_control_group", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        adminid = data.get("adminid", "")
        await self.channel_layer.group_send(
            "quiz_control_group",
            {
                "type": "quiz_control",
                "show": data.get("show", False),
                "action": data.get("action", ""),
                "adminid":adminid
            }
        )

    async def quiz_control(self, event):
        await self.send(text_data=json.dumps({
            "show": event["show"],
            "action": event["action"],
            "adminid":event["adminid"]
        }))

class ResultsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "quiz_results"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connection',
            'message': 'Connected to results channel'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data.get('type') == 'show_results':
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "send_results_control",
                        "show": True,
                        "action": "show_results"
                    }
                )
        except json.JSONDecodeError:
            pass

    async def send_results_control(self, event):
        await self.send(text_data=json.dumps({
            "type": "results_control",
            "action": event["action"],
            "show": event["show"]
        }))