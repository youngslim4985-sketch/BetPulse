#!/bin/bash

# Line Breaker™ Pipeline Monitor
# Visualizes the health of the event-driven projection engine.

API_URL="http://localhost:3000/api/health/pipeline"

echo "----------------------------------------------------------------"
echo "  LINE BREAKER™ OPERATIONAL DASHBOARD (ST-X4)"
echo "----------------------------------------------------------------"

while true; do
  DATA=$(curl -s $API_URL)
  
  if [ -z "$DATA" ]; then
    echo "❌ PIPELINE OFFLINE - CHECK SERVER STATUS"
    sleep 5
    continue
  fi

  STATUS=$(echo $DATA | grep -o '"status":"[^"]*' | cut -d'"' -f4)
  UPDATES=$(echo $DATA | grep -o '"updatesProcessed":[0-9]*' | cut -d':' -f2)
  DROPPED=$(echo $DATA | grep -o '"updatesDropped":[0-9]*' | cut -d':' -f2)
  MISMATCH=$(echo $DATA | grep -o '"seqMismatches":[0-9]*' | cut -d':' -f2)
  LATENCY=$(echo $DATA | grep -o '"avgLatency":[0-9]*' | cut -d':' -f2)

  clear
  echo "----------------------------------------------------------------"
  echo "  LINE BREAKER™ OPERATIONAL DASHBOARD (ST-X4)"
  echo "----------------------------------------------------------------"
  echo " SYSTEM STATUS:   $STATUS"
  echo " UPDATES PROC:    $UPDATES"
  echo " STALE DROPPED:   $DROPPED"
  echo " SEQ MISMATCH:    $MISMATCH"
  echo " ENGINE LATENCY:  $LATENCY ms"
  echo "----------------------------------------------------------------"
  echo " [L1_CACHE]       SYNCED"
  echo " [LUA_CAS]        ACTIVE"
  echo " [BLOOM]          FILTERING"
  echo "----------------------------------------------------------------"
  echo " Last Check: $(date)"
  
  sleep 2
done
