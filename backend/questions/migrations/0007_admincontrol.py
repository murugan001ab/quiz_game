# Generated by Django 5.2 on 2025-07-23 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("questions", "0006_question_discription"),
    ]

    operations = [
        migrations.CreateModel(
            name="AdminControl",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.CharField(max_length=50, unique=True)),
                ("value", models.IntegerField()),
            ],
        ),
    ]
