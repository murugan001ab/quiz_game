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




connected_users = set()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = None  # Track per-connection username
        await self.channel_layer.group_add("chat_group", self.channel_name)
        await self.accept()
        print("✅ User connected to /ws/name/")

    async def disconnect(self, close_code):
        if self.username and self.username in connected_users:
            connected_users.remove(self.username)

            # Update all clients
            await self.channel_layer.group_send(
                "chat_group", {
                    "type": "send_user_list",
                    "user_list": list(connected_users)
                }
            )

        await self.channel_layer.group_discard("chat_group", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        username = data.get('username')
        print(f"Received username: {username}")
        print(f"Connected users before: {connected_users}")

        if username:
            self.username = username
            connected_users.add(username)

            # Notify all clients of updated user list
            await self.channel_layer.group_send(
                "chat_group", {
                    "type": "send_user_list",
                    "user_list": list(connected_users)
                }
            )

    async def send_user_list(self, event):
        await self.send(text_data=json.dumps({
            "type": "user_list",
            "user_list": event["user_list"]
        }))
        print(f"Connected users after: {connected_users}")
