"""Kakefile for jseek backend."""
from kake import Project

project = Project(name='jseek')

project.add_include(['include'])
project.add_lib(['libs'])
project.add_src(['jseek.cpp'])

project.build()
