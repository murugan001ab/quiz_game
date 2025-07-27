from rest_framework import serializers
from .models import User, Question,Admin,AdminControl


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['name', 'password']

    def create(self, validated_data):
        admin = Admin(name=validated_data['name'])
        admin.set_password(validated_data['password'])
        admin.save()
        return admin



class AdminControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminControl
        fields = ['key', 'value']