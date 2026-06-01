# Use a slim Python base image to keep size down
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Set work directory
WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
# Use cpu version of torch if still in requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
# honors .dockerignore to EXPLICITLY skip data/, dataset/, and venv/
COPY . .

# Expose port
EXPOSE 8080

# Command to run the application
CMD ["python", "-m", "src.main"]
