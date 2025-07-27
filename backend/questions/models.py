from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password



class Admin(models.Model):
    name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.name

class User(models.Model):
    name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)  # Store quiz score
    admin_id=models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Question(models.Model):
    STATUS_CHOICES = [
        ("answered", "Answered"),
        ("skipped", "Skipped"),
        ("not answered", "Not Answered"),
    ]

    question_text = models.TextField()
    options = models.JSONField()  # Example: ["A", "B", "C", "D"]
    correct_answer = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="not answered"
    )
    discription=models.CharField(max_length=5000)

    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return self.question_text



class AdminControl(models.Model):
    key = models.CharField(max_length=50, unique=True)
    value = models.IntegerField()

    def __str__(self):
        return f"{self.key} => {self.value}"
