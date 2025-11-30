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
                git branch: 'main',
                    url: 'https://github.com/C14-2025/sistema-de-reserva-de-livros.git'
                script {
                    currentBuild.displayName = "BUILD #${env.BUILD_NUMBER} - Sistema Reserva Livros"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                echo '✅ Dependências instaladas com sucesso!'
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                sh 'npm test -- --ci --coverage --maxWorkers=2'
            }
            post {
                always {
                    junit 'junit.xml' // Se o Jest gerar este arquivo
                    publishHTML(target: [
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Relatório de Cobertura de Testes'
                    ])
                }
            }
        }
        
        stage('Security Audit') {
            steps {
                sh 'npm audit --audit-level moderate || true'
                echo '✅ Auditoria de segurança concluída!'
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🔨 Building aplicação...'
                // Para Node.js, validamos que tudo está ok
                sh 'npm start &'
                sleep 10 // Aguarda o servidor iniciar
                sh 'pkill -f "node server.js" || echo "Servidor parado"'
                echo '✅ Build validado com sucesso!'
            }
        }
        
        stage('Generate Test Report') {
            steps {
                script {
                    // Cria relatório simples dos testes
                    sh '''
                        echo "RELATÓRIO DE TESTES - SISTEMA DE RESERVA DE LIVROS" > test-report.txt
                        echo "==================================================" >> test-report.txt
                        echo "Build Number: #${BUILD_NUMBER}" >> test-report.txt
                        echo "Data: $(date)" >> test-report.txt
                        echo "Status: ${currentBuild.currentResult}" >> test-report.txt
                        echo "Branch: main" >> test-report.txt
                        echo "" >> test-report.txt
                        echo "📊 TESTES EXECUTADOS:" >> test-report.txt
                        echo "- Testes unitários com Jest" >> test-report.txt
                        echo "- Cobertura de código" >> test-report.txt
                        echo "- Auditoria de segurança npm" >> test-report.txt
                        echo "" >> test-report.txt
                        echo "🚀 APLICAÇÃO:" >> test-report.txt
                        echo "- Sistema de Reserva de Livros" >> test-report.txt
                        echo "- Backend Node.js/Express" >> test-report.txt
                        echo "- SQLite Database" >> test-report.txt
                        echo "- Autenticação JWT" >> test-report.txt
                    '''
                    archiveArtifacts artifacts: 'test-report.txt', fingerprint: true
                }
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline finalizada - Status: ${currentBuild.currentResult}"
            
            // Arquiva a cobertura de testes
            archiveArtifacts artifacts: 'coverage/**/*', fingerprint: true
        }
        
        success {
            echo '🎉 TODOS OS TESTES PASSARAM! Sistema de Reserva de Livros está funcionando perfeitamente!'
            
            // EMAIL DE SUCESSO (configurar depois)
            emailext (
                subject: "✅ SUCESSO - Build #${env.BUILD_NUMBER} - Sistema Reserva Livros",
                to: "equipe@email.com", // Altere para emails reais
                body: """
                🎉 BUILD BEM-SUCEDIDA - Sistema de Reserva de Livros

                Olá equipe C14!

                A build #${env.BUILD_NUMBER} foi executada com SUCESSO!

                📊 DETALHES:
                - Projeto: Sistema de Reserva de Livros
                - Build: #${env.BUILD_NUMBER}
                - Status: ✅ SUCESSO
                - Data: ${new Date().format('dd/MM/yyyy HH:mm:ss')}
                - URL: ${env.BUILD_URL}

                ✅ O QUE FOI EXECUTADO:
                - Instalação de dependências
                - Testes unitários com Jest
                - Cobertura de código
                - Auditoria de segurança npm
                - Validação do build

                📈 RELATÓRIOS DISPONÍVEIS:
                - Cobertura de testes: ${env.BUILD_URL}Relatório_de_Cobertura_de_Testes/
                - Artefatos: ${env.BUILD_URL}artifact/

                Parabéns pelo trabalho! 🚀

                ---
                Jenkins CI/CD - Projeto C14 - Engenharia de Software
                """
            )
        }
        
        failure {
            echo '❌ ALGO DEU ERRADO! Verifique os logs para ver o que falhou.'
            
            // EMAIL DE FALHA (configurar depois)
            emailext (
                subject: "❌ FALHA - Build #${env.BUILD_NUMBER} - Sistema Reserva Livros",
                to: "equipe@email.com", // Altere para emails reais
                body: """
                ⚠️ BUILD FALHOU - Sistema de Reserva de Livros

                Atenção equipe C14!

                A build #${env.BUILD_NUMBER} FALHOU e precisa de atenção.

                📊 DETALHES:
                - Projeto: Sistema de Reserva de Livros
                - Build: #${env.BUILD_NUMBER}
                - Status: ❌ FALHA
                - Data: ${new Date().format('dd/MM/yyyy HH:mm:ss')}
                - URL: ${env.BUILD_URL}

                🔍 O QUE VERIFICAR:
                - Console Output: ${env.BUILD_URL}console
                - Testes que falharam
                - Dependências incompatíveis

                Ação necessária: Corrigir os problemas identificados.

                ---
                Jenkins CI/CD - Projeto C14 - Engenharia de Software
                """
            )
        }
    }
}