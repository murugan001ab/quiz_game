from django.urls import path
from .views import UserCreateView,AdminLoginView,AdminCreateView,QuizQuestionDetail,QuizQuestionListCreate,AdminResetPasswordView,AdminControlView
from .views import home

urlpatterns = [
    path('users/', UserCreateView.as_view(), name='create-user'),
    path('api/admin/login/',AdminLoginView.as_view(), name='admin-login'),
    path('api/admin/create/', AdminCreateView.as_view(), name='admin-create'),
    path('questions/', QuizQuestionListCreate.as_view()),
    path('questions/<int:pk>/<int:admin_id>/', QuizQuestionDetail.as_view()),
    path('api/admin/forgot-password/', AdminResetPasswordView.as_view()),
    path('', home, name='home'),
    ]
