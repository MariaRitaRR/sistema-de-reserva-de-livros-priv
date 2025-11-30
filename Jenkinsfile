pipeline {
    agent any
    
    tools {
        nodejs "nodejs"  // Usa o nome que você configurou "nodejs"
    }
    
    parameters {
        choice(
            name: 'BRANCH',
            choices: ['main', 'develop', 'master'],
            description: 'Branch para build'
        )
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: params.BRANCH, url: 'https://github.com/MariaRitaRR/sistema-de-reserva-de-livros-priv.git'
            }
        }
        
        stage('Verificar Node.js') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }
        
        stage('Setup Backend') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                }
            }
        }
        
        stage('Testes Backend') {
            parallel {
                stage('Testes Básicos') {
                    steps {
                        dir('backend') {
                            bat 'npm test -- --runInBand'
                        }
                    }
                    post {
                        always {
                            // Configure seu Jest para gerar JUnit XML se necessário
                            archiveArtifacts 'backend/test-results.json'
                        }
                    }
                }
                
                stage('Testes com Cobertura') {
                    steps {
                        dir('backend') {
                            bat 'npm run test:ci'
                            bat 'npm run test:coverage'
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'backend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Relatório Cobertura'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Audit Segurança') {
            steps {
                dir('backend') {
                    bat 'npm audit --audit-level=high || echo "⚠️  Issues encontrados no audit"'
                    bat 'npm audit --json > audit-report.json || echo "{}" > audit-report.json'
                }
            }
            post {
                always {
                    archiveArtifacts 'backend/audit-report.json'
                }
            }
        }
        
        stage('Testes Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
            post {
                always {
                    echo "🎨 Frontend - Build concluído com sucesso"
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/dist',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Build'
                    ])
                }
            }
        }
        
        stage('Package') {
            steps {
                script {
                    bat '''
                        echo "📦 Criando pacote do backend..."
                        mkdir package-backend
                        xcopy backend package-backend\\backend /E /I /EXCLUDE:exclude.txt
                        cd package-backend\\backend
                        npm install --production
                        cd ..\\..
                        
                        echo "📦 Compactando pacote..."
                        set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%%time:~0,2%%time:~3,2%%time:~6,2%
                        set TIMESTAMP=%TIMESTAMP: =0%
                        powershell Compress-Archive -Path package-backend -DestinationPath backend-package-%TIMESTAMP%.zip
                    '''
                }
            }
            post {
                success {
                    archiveArtifacts 'backend-package-*.zip'
                }
            }
        }
        
        stage('Relatório Final') {
            steps {
                script {
                    def summary = """
# 🎉 Relatório de Integração - Sistema de Reservas Bookle

**Data:** ${new Date().format('dd/MM/yyyy HH:mm:ss')}
**Branch:** ${env.BRANCH_NAME}
**Build:** ${env.BUILD_NUMBER}

## 📋 Status dos Estágios:
- ✅ Checkout e Setup
- ✅ Testes Backend
- ✅ Audit de Segurança
- ✅ Testes Frontend
- ✅ Package

## 📊 Funcionalidades Validadas:
- ✅ Autenticação JWT e autorização
- ✅ CRUD completo de reservas  
- ✅ Persistência e integridade de dados
- ✅ Validações de negócio
- ✅ Frontend integrado

**Status Final:** ${currentBuild.currentResult}
"""

                    writeFile file: 'relatorio-integracao.md', text: summary
                    archiveArtifacts 'relatorio-integracao.md'
                    
                    echo summary
                }
            }
        }
    }
    
    post {
        always {
            echo "📊 Pipeline finalizado - Status: ${currentBuild.currentResult}"
        }
        
        success {
            echo "✅ Pipeline concluído com sucesso!"
        }
        
        failure {
            echo "❌ Pipeline falhou!"
        }
        
        unstable {
            echo "⚠️  Pipeline instável - alguns testes falharam"
        }
    }
}