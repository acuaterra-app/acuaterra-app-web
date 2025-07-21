#!/usr/bin/env pwsh
# Script para ejecutar todas las pruebas del módulo CRUD de Usuarios
# 📋 ACTIVIDAD: 05 REALIZAR PRUEBAS AL SOFTWARE PARA VERIFICAR SU FUNCIONALIDAD

Write-Host "🧪 EJECUTANDO SUITE COMPLETA DE PRUEBAS - MÓDULO CRUD USUARIOS" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# Función para mostrar resultados
function Show-TestResults {
    param($TestType, $ExitCode)
    if ($ExitCode -eq 0) {
        Write-Host "✅ $TestType - EXITOSAS" -ForegroundColor Green
    } else {
        Write-Host "❌ $TestType - FALLOS DETECTADOS" -ForegroundColor Red
    }
}

# Variables de control
$UnitTestsExitCode = 0
$IntegrationTestsExitCode = 0
$E2ETestsExitCode = 0

Write-Host ""
Write-Host "🔧 1. PRUEBAS UNITARIAS" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow
Write-Host "Ejecutando pruebas de hooks y servicios..."

try {
    npm run test:unit:coverage
    $UnitTestsExitCode = $LASTEXITCODE
} catch {
    Write-Host "Error ejecutando pruebas unitarias: $_" -ForegroundColor Red
    $UnitTestsExitCode = 1
}

Show-TestResults "PRUEBAS UNITARIAS" $UnitTestsExitCode

Write-Host ""
Write-Host "🔗 2. PRUEBAS DE INTEGRACIÓN" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host "Ejecutando pruebas de componentes integrados..."

try {
    npm run test:integration:coverage
    $IntegrationTestsExitCode = $LASTEXITCODE
} catch {
    Write-Host "Error ejecutando pruebas de integración: $_" -ForegroundColor Red
    $IntegrationTestsExitCode = 1
}

Show-TestResults "PRUEBAS DE INTEGRACIÓN" $IntegrationTestsExitCode

Write-Host ""
Write-Host "🌐 3. PRUEBAS END-TO-END (E2E)" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow
Write-Host "Ejecutando pruebas de interfaz completa..."

try {
    npm run test:e2e
    $E2ETestsExitCode = $LASTEXITCODE
} catch {
    Write-Host "Error ejecutando pruebas E2E: $_" -ForegroundColor Red
    $E2ETestsExitCode = 1
}

Show-TestResults "PRUEBAS E2E" $E2ETestsExitCode

Write-Host ""
Write-Host "📊 RESUMEN FINAL DE PRUEBAS" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Magenta

Show-TestResults "🔧 Pruebas Unitarias" $UnitTestsExitCode
Show-TestResults "🔗 Pruebas de Integración" $IntegrationTestsExitCode  
Show-TestResults "🌐 Pruebas E2E" $E2ETestsExitCode

$TotalExitCode = $UnitTestsExitCode + $IntegrationTestsExitCode + $E2ETestsExitCode

if ($TotalExitCode -eq 0) {
    Write-Host ""
    Write-Host "🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "✅ El módulo CRUD de Usuarios está funcionando correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 ENTREGABLE ACADÉMICO COMPLETO:" -ForegroundColor Cyan
    Write-Host "- ✅ Pruebas Unitarias (hooks y servicios)" -ForegroundColor White
    Write-Host "- ✅ Pruebas de Integración (componentes)" -ForegroundColor White
    Write-Host "- ✅ Pruebas End-to-End (interfaz completa)" -ForegroundColor White
    Write-Host "- ✅ Cobertura de código generada" -ForegroundColor White
    Write-Host "- ✅ Reportes de Playwright disponibles" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  ALGUNAS PRUEBAS FALLARON" -ForegroundColor Red
    Write-Host "Revisa los logs anteriores para detalles específicos" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 COMANDOS INDIVIDUALES PARA DEBUG:" -ForegroundColor Cyan
    Write-Host "- npm run test:unit:coverage" -ForegroundColor White
    Write-Host "- npm run test:integration:coverage" -ForegroundColor White  
    Write-Host "- npm run test:e2e" -ForegroundColor White
    Write-Host "- npm run test:e2e:report" -ForegroundColor White
}

Write-Host ""
Write-Host "📁 UBICACIÓN DE ARCHIVOS DE PRUEBA:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📂 src/tests/unit/" -ForegroundColor White
Write-Host "   ├── userService.test.ts" -ForegroundColor Gray
Write-Host "   └── useUsers.test.ts" -ForegroundColor Gray
Write-Host "📂 src/tests/integration/" -ForegroundColor White  
Write-Host "   └── usersCRUD.integration.test.tsx" -ForegroundColor Gray
Write-Host "📂 e2e/" -ForegroundColor White
Write-Host "   └── usersCRUD.e2e.spec.ts" -ForegroundColor Gray
Write-Host "📂 src/tests/__mocks__/" -ForegroundColor White
Write-Host "   └── userService.ts" -ForegroundColor Gray

exit $TotalExitCode
