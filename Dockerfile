# Use the official Python image.
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Set environment variable for Flask
ENV FLASK_APP=login_backend.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8080

# If you use gunicorn (recommended for production), uncomment the next line:
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 login_backend:app

# If you want to use Flask's built-in server (not recommended for production), comment the above and uncomment:
# CMD ["flask", "run"]