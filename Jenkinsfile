pipeline {
    agent any
    
    tools {
        nodejs "nodejs"
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

        /* ================================
         * CHECKOUT
         * ================================ */
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

        /* ================================
         * BACKEND
         * ================================ */

        stage('Setup Backend') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Testes Backend') {
            parallel {

                basic: {
                    stage('Testes Básicos') {
                        steps {
                            dir('backend') {
                                bat 'npm test -- --runInBand'
                            }
                        }
                        post {
                            always {
                                script {
                                    if (fileExists('backend/test-results.json')) {
                                        archiveArtifacts 'backend/test-results.json'
                                    } else {
                                        echo "ℹ️ test-results.json não encontrado."
                                    }
                                }
                            }
                        }
                    }
                }

                coverage: {
                    stage('Cobertura de Testes') {
                        steps {
                            dir('backend') {
                                bat 'npm run test:ci'
                                bat 'npm run test:coverage'
                            }
                        }
                        post {
                            always {
                                archiveArtifacts 'backend/coverage/lcov.info'
                                archiveArtifacts 'backend/coverage/coverage-final.json'

                                script {
                                    if (fileExists('backend/coverage/lcov-report/index.html')) {
                                        echo "📊 Relatório HTML encontrado!"
                                        bat 'powershell Compress-Archive -Path backend/coverage/lcov-report -DestinationPath coverage-report.zip'
                                        archiveArtifacts 'coverage-report.zip'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        /* ================================
         * AUDIT DE SEGURANÇA
         * ================================ */
        stage('Audit Segurança') {
            steps {
                dir('backend') {
                    bat 'npm audit --audit-level=high || echo "⚠️ Issues encontradas"'
                    bat 'npm audit --json > audit-report.json || echo "{}" > audit-report.json'
                }
            }
            post {
                always {
                    archiveArtifacts 'backend/audit-report.json'
                }
            }
        }

        /* ================================
         * FRONTEND
         * ================================ */
        stage('Testes Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
            post {
                always {
                    echo "🎨 Frontend - Build concluído!"
                    archiveArtifacts 'frontend/dist/**/*'
                }
            }
        }

        /* ================================
         * PACKAGE
         * ================================ */
        stage('Package') {
            steps {
                script {
                    bat '''
                        echo "📦 Criando pacote do backend..."
                        if exist package-backend rmdir /s /q package-backend
                        mkdir package-backend

                        echo "📂 Copiando arquivos do backend..."
                        if exist exclude.txt (
                            xcopy backend package-backend\\backend /E /I /EXCLUDE:exclude.txt
                        ) else (
                            xcopy backend package-backend\\backend /E /I
                        )

                        echo "🚀 Instalando dependências de produção..."
                        cd package-backend\\backend
                        npm install --production
                        cd ..\\..

                        echo "📦 Compactando pacote..."
                        set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%%time:~0,2%%time:~3,2%%time:~6,2%
                        set TIMESTAMP=%TIMESTAMP: =0%

                        powershell Compress-Archive -Path package-backend -DestinationPath backend-package-%TIMESTAMP%.zip

                        echo "✅ Pacote criado: backend-package-%TIMESTAMP%.zip"
                    '''
                }
            }
            post {
                success {
                    archiveArtifacts 'backend-package-*.zip'
                }
            }
        }

        /* ================================
         * RELATÓRIO FINAL
         * ================================ */
        stage('Relatório Final') {
            steps {
                script {

                    def coverage = "N/A"
                    if (fileExists('backend/coverage/coverage-summary.json')) {
                        try {
                            def sum = readJSON file: 'backend/coverage/coverage-summary.json'
                            coverage = "${sum.total.lines.pct}%"
                        } catch (e) {
                            coverage = "Relatório disponível"
                        }
                    }

                    def summary = """
# 🎉 Relatório de Integração - Sistema de Reservas Bookle

**Data:** ${new Date().format('dd/MM/yyyy HH:mm:ss')}
**Branch:** ${params.BRANCH}
**Build:** ${env.BUILD_NUMBER}
**Cobertura de Testes:** ${coverage}

## Status:
- Backend: OK  
- Frontend: OK  
- Cobertura: ${coverage}  
- Package: OK  

Status Final: ${currentBuild.currentResult}
"""

                    writeFile file: 'relatorio-integracao.md', text: summary
                    archiveArtifacts 'relatorio-integracao.md'
                }
            }
        }

    } // fim stages

    /* ================================
     * POST BUILD
     * ================================ */
    post {
        always {
            echo "📊 Pipeline finalizada — Status: ${currentBuild.currentResult}"
        }
        success {
            echo "🎉 Pipeline concluída com SUCESSO!"
        }
        failure {
            echo "❌ Pipeline falhou!"
        }
        unstable {
            echo "⚠️ Pipeline instável!"
        }
    }
}
