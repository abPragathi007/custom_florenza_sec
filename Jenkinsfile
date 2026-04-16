pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git 'https://github.com/abPragathi007/custom_florenza_sec.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t florenza-app .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop florenza || true
                docker rm florenza || true
                docker run -d -p 80:3000 --name florenza florenza-app
                '''
            }
        }
    }
}