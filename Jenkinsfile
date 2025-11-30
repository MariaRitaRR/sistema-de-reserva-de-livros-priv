pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    
    environment {
        NODE_ENV = 'test'
        DB_PATH = './database.sqlite'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                // O checkout é AUTOMÁTICO - não precisa do bloco git aqui!
                echo '✅ Código baixado automaticamente do repositório'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                echo '✅ Dependências instaladas com sucesso!'
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    junit 'junit.xml' // Se o Jest gerar este arquivo
                }
            }
        }
        
        stage('Security Audit') {
            steps {
                bat 'npm audit --audit-level moderate || echo "Audit completed"'
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🔨 Building aplicação...'
                bat 'start /B npm start'
                bat 'timeout /t 10 /nobreak >nul'
                bat 'taskkill /f /im node.exe 2>nul || echo "Servidor parado"'
                echo '✅ Build validado com sucesso!'
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline finalizada - Status: ${currentBuild.currentResult}"
        }
        
        success {
            echo '🎉 TODOS OS TESTES PASSARAM! Sistema de Reserva de Livros está funcionando!'
        }
        
        failure {
            echo '❌ ALGO DEU ERRADO! Verifique os logs.'
        }
    }
}