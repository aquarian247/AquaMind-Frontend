"""
Models for the Scenario Planning and Simulation module.

This module enables aquaculture managers to create, manage, and analyze
hypothetical scenarios for salmon farming operations using configurable
biological models (TGC, FCR, and mortality models).
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()
