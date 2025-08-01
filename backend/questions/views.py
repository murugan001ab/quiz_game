from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import User, Question,Admin
from .serializer import UserSerializer, QuestionSerializer,AdminSerializer,AdminControl,AdminControlSerializer
from django.shortcuts import get_object_or_404

class UserCreateView(APIView):
    """Save user name & score"""

    def get(self, request):
        admin_id = request.query_params.get('admin_id')
        if admin_id:
            users = User.objects.filter(admin_id=admin_id).order_by('-score')
        else:
            users = User.objects.all().order_by('-score')
        
        data = [{
            'name': user.aname,
            'score': user.score
        } for user in users]
        
        return Response(data)
    def post(self, request):    
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print(request.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuizQuestionListCreate(APIView):
   
    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class QuestionListByAdmin(APIView):
    def get(self, request, admin_id):
        questions = Question.objects.filter(admin_id=admin_id)  # Use filter() not all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
    
class QuizQuestionDetail(APIView):
   
    def put(self, request, pk):
        question = get_object_or_404(Question, pk=pk)
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        question = get_object_or_404(Question, pk=pk)
        question.delete()
        return Response(status=204)

class AdminLoginView(APIView):
    def post(self, request):
        name = request.data.get('name')
        password = request.data.get('password')

        if not name or not password:
            return Response({"error": "Name and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            admin = Admin.objects.get(name=name)

            if admin.check_password(password):
                return Response({"message": "Login successful", "admin_id": admin.id}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

        except Admin.DoesNotExist:
            return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    



class AdminCreateView(APIView):
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Admin created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminResetPasswordView(APIView):
    def post(self, request):
        name = request.data.get('name')
        new_password = request.data.get('new_password')

        if not name or not new_password:
            return Response({"error": "Username and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            admin = Admin.objects.get(name=name)
            admin.set_password(new_password)
            admin.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        except Admin.DoesNotExist:
            return Response({"error": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)



class AdminControlView(APIView):
   
    def get(self, request):
        try:
            obj = AdminControl.objects.get(key='index')
            return Response({'index': obj.value}, status=200)
        except AdminControl.DoesNotExist:
            return Response({'error': 'Index not set'}, status=404)

    def post(self, request):
        index_value = request.data.get('index')
        if index_value is None:
            return Response({'error': 'Index value is required'}, status=400)

        obj, created = AdminControl.objects.get_or_create(key='index')
        obj.value = index_value
        obj.save()
        return Response({'message': 'Index updated', 'index': obj.value}, status=200)

from django.shortcuts import render

def home(request):
    return render(request, 'home.html')