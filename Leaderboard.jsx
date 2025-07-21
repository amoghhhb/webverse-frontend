// Leaderboard.jsx
"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Trophy,
  Clock,
  Target,
  User,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)

  const BACKEND_URL = "https://webverse-production.up.railway.app"

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0")
    const secs = String(seconds % 60).padStart(2, "0")
    return `${mins}:${secs}`
  }

  const calculateScore = (time) => Math.floor((600 - time) * 1.5)
  const playerScore = calculateScore(timeTaken)
  const playerTime = formatTime(timeTaken)

  const saveScoreLocally = () => {
    const pendingScores = JSON.parse(localStorage.getItem("pendingScores") || "[]")
    pendingScores.push({
      name: userData.name,
      department: userData.department,
      timeTaken,
      score: playerScore,
      timestamp: Date.now(),
    })
    localStorage.setItem("pendingScores", JSON.stringify(pendingScores))
  }

  const submitScoreToServer = async (signal) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      const response = await fetch(`${BACKEND_URL}/api/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          department: userData.department,
          timeTaken,
          score: playerScore,
        }),
        signal: controller.signal,
        mode: "cors",
      })
      clearTimeout(timeoutId)
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      return true
    } catch (err) {
      console.error("Score submission failed:", err)
      return false
    }
  }

  const fetchLeaderboard = async (signal) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      const response = await fetch(`${BACKEND_URL}/api/leaderboard`, {
        signal: controller.signal,
        mode: "cors",
      })
      clearTimeout(timeoutId)
      if (!response.ok) throw new Error("Failed to fetch leaderboard")
      const data = await response.json()
      return data.data.map((player, index) => ({
        ...player,
        rank: index + 1,
        timeFormatted: formatTime(player.timeTaken),
        isCurrentPlayer: player.name === userData.name,
        score: calculateScore(player.timeTaken),
      }))
    } catch (err) {
      console.error("Fetch leaderboard failed:", err)
      throw err
    }
  }

  const submitPendingScores = async () => {
    const pendingScores = JSON.parse(localStorage.getItem("pendingScores") || "[]")
    const successfulSubmissions = []
    for (const score of pendingScores) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        const response = await fetch(`${BACKEND_URL}/api/players`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(score),
          signal: controller.signal,
          mode: "cors",
        })
        clearTimeout(timeoutId)
        if (response.ok) successfulSubmissions.push(score.timestamp)
      } catch (err) {
        console.error("Failed to submit pending score:", err)
      }
    }
    if (successfulSubmissions.length > 0) {
      const remaining = pendingScores.filter(s => !successfulSubmissions.includes(s.timestamp))
      localStorage.setItem("pendingScores", JSON.stringify(remaining))
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const loadData = async () => {
      try {
        setLoading(true)
        setOfflineMode(false)
        await submitPendingScores()
        const submitted = await submitScoreToServer(signal)
        if (!submitted) {
          saveScoreLocally()
          setOfflineMode(true)
        }
        const data = await fetchLeaderboard(signal)
        setLeaderboard(data)
      } catch (err) {
        saveScoreLocally()
        setOfflineMode(true)
        setError({
          message: "Connection issue",
          details: "Data will sync when online",
        })
      } finally {
        setLoading(false)
      }
    }

    if (navigator.onLine) {
      loadData()
    } else {
      setOfflineMode(true)
      setError({
        message: "You are offline",
        details: "Scores will sync when online",
      })
      setLoading(false)
    }

    return () => controller.abort()
  }, [timeTaken, userData])

  const handleRetry = () => {
    if (!navigator.onLine) {
      setError({
        message: "Still offline",
        details: "Please check your internet connection",
      })
      return
    }
    window.location.reload()
  }

  const currentPlayerRank = leaderboard.find(p => p.isCurrentPlayer)?.rank || "--"
  const pendingScoresCount = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("pendingScores") || "[]").length
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10">
          <CardContent className="p-8 text-center text-white">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" />
            Loading leaderboard...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {error ? (
          <Card className="bg-red-500/10">
            <CardHeader>
              <CardTitle className="flex gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                {error.message}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription className="text-red-300">
                  {error.details}
                </AlertDescription>
              </Alert>
              <Button onClick={handleRetry} disabled={!navigator.onLine} className="mt-4">
                {navigator.onLine ? "Retry" : "Offline Mode"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <Trophy className="text-yellow-400" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/10">
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-white text-center">
                  <div>
                    <Trophy className="mx-auto text-yellow-400" />
                    <p className="text-sm">Rank</p>
                    <p className="font-bold">{currentPlayerRank}</p>
                  </div>
                  <div>
                    <Target className="mx-auto text-blue-400" />
                    <p className="text-sm">Score</p>
                    <p className="font-bold">{playerScore}</p>
                  </div>
                  <div>
                    <Clock className="mx-auto text-green-400" />
                    <p className="text-sm">Time</p>
                    <p className="font-bold">{playerTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-white">
                      <TableHead>Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.length > 0 ? (
                      leaderboard.map((player) => (
                        <TableRow
                          key={player._id || `${player.name}-${player.rank}`}
                          className={
                            player.isCurrentPlayer ? "bg-emerald-500/10" : ""
                          }
                        >
                          <TableCell>{player.rank}</TableCell>
                          <TableCell>
                            {player.name}{" "}
                            {player.isCurrentPlayer && (
                              <Badge className="ml-1 text-xs">You</Badge>
                            )}
                          </TableCell>
                          <TableCell>{player.department || "-"}</TableCell>
                          <TableCell>{player.timeFormatted}</TableCell>
                          <TableCell>{player.score}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-white/60">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="bg-white/10">
          <CardContent className="text-center py-4 text-white/60 text-sm">
            World Wide Web Day Challenge © {new Date().getFullYear()}
            {pendingScoresCount > 0 && (
              <div className="mt-2">
                <Badge className="text-orange-300">
                  <Wifi className="h-3 w-3 mr-1" />
                  {pendingScoresCount} pending
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Leaderboard
