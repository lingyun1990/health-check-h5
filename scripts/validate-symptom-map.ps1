param(
  [string]$JsonPath = "src/data/symptomMap.json",
  [string]$CsvPath = "data/symptom-map-review.csv"
)

$ErrorActionPreference = "Stop"

function Assert-Equal {
  param(
    [string]$Label,
    [object]$Actual,
    [object]$Expected
  )

  if ($Actual -ne $Expected) {
    throw "$Label mismatch. Actual: $Actual; Expected: $Expected"
  }
}

$map = Get-Content -Raw -Encoding UTF8 -LiteralPath $JsonPath | ConvertFrom-Json
$expectedTotals = [ordered]@{}
foreach ($factor in $map.factors) {
  $expectedTotals[$factor.name] = [int]$factor.total
}

Assert-Equal "Factor count" $map.factors.Count 7
Assert-Equal "Symptom count" $map.symptoms.Count 95

$actualTotals = [ordered]@{}
foreach ($factorName in $expectedTotals.Keys) {
  $actualTotals[$factorName] = 0
}

foreach ($symptom in $map.symptoms) {
  foreach ($mark in $symptom.marks.PSObject.Properties) {
    if (-not $expectedTotals.Contains($mark.Name)) {
      throw "Unknown factor '$($mark.Name)' on symptom id $($symptom.id)."
    }
    if ($mark.Value -ne "@") {
      throw "Invalid mark '$($mark.Value)' on symptom id $($symptom.id), factor '$($mark.Name)'."
    }
    $actualTotals[$mark.Name] += 1
  }
}

foreach ($factorName in $expectedTotals.Keys) {
  Assert-Equal "$factorName @ count" $actualTotals[$factorName] $expectedTotals[$factorName]
}

if (Test-Path -LiteralPath $CsvPath) {
  $csv = Import-Csv -Encoding UTF8 -LiteralPath $CsvPath
  Assert-Equal "CSV row count" $csv.Count 95

  $expectedColumns = @("id", "name") + @($expectedTotals.Keys)
  $actualColumns = @($csv[0].PSObject.Properties.Name)
  Assert-Equal "CSV column count" $actualColumns.Count $expectedColumns.Count

  for ($index = 0; $index -lt $expectedColumns.Count; $index++) {
    Assert-Equal "CSV column $index" $actualColumns[$index] $expectedColumns[$index]
  }

  foreach ($row in $csv) {
    foreach ($factorName in $expectedTotals.Keys) {
      if ($row.$factorName -ne "" -and $row.$factorName -ne "@") {
        throw "Invalid CSV mark '$($row.$factorName)' on row id $($row.id), factor '$factorName'."
      }
    }
  }
}

Write-Host "symptomMap validation passed."
foreach ($factorName in $actualTotals.Keys) {
  Write-Host "$factorName=$($actualTotals[$factorName])"
}
