/[0-9]+\./ {
  n = split(versionDiff, versions, ".")
  if(n>NF) nIter=n; else nIter=NF
  lastNonzero = nIter
  for(i = 1; i <= nIter; ++i) {
    if(int(versions[i]) > 0) {
      lastNonzero = i
    }
    $i = versions[i] + $i
  }
  for(i = lastNonzero+1; i <= nIter; ++i) {
    $i = 0
  }
  print
}
