import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'
import Head from 'next/head'

interface CallLog {
  id: string
  created_at: string
  "Summary Text": string
  "Engagement Text": string
  "Engagement": number
  "Objection Hand": number
  "Information G": number
  "Program Expla": number
  "Closing Skill": number
  "Overall Effecti": number
  "Key Areas for Improvement": string
  "Call Length": number
  "AI assistant": string
  "recording URL": string
}

export default function Home() {
  const [data, setData] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [chart, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchData = async () => {
      const { data: logs } = await supabase
        .from('Call Logs')
        .select('*')
        .order('created_at', { ascending: false })
      
      setData(logs || [])
      setLoading(false)
      initChart(logs || [])
    }

    fetchData()

    // Cleanup
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [])

  function initChart(logs: CallLog[]) {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement
    if (!ctx) return

    if (chart) {
      chart.destroy()
    }

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: logs.map((_, index) => `Call ${index + 1}`).reverse(),
        datasets: [{
          label: 'Call Success Rate',
          data: logs.map(log => log["Overall Effecti"]).reverse(),
          borderColor: '#00BFFF',
          backgroundColor: 'rgba(0, 191, 255, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#00BFFF',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#00BFFF',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              callback: function(value) {
                return value + '/5'
              },
              color: '#ffffff',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: '#ffffff',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            titleFont: {
              size: 16,
              weight: 'bold'
            },
            bodyColor: '#FFFFFF',
            bodyFont: {
              size: 14
            },
            borderColor: '#00BFFF',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return 'Rating: ' + context.parsed.y + '/5'
              }
            }
          }
        }
      }
    })

    setChart(newChart)
  }

  function updateChart(selectedOption: string) {
    if (!chart || !data.length) return

    const getData = (option: string) => {
      switch(option) {
        case 'engagement': return data.map(log => log["Engagement"])
        case 'objectionHandling': return data.map(log => log["Objection Hand"])
        case 'informationGathering': return data.map(log => log["Information G"])
        case 'programExplanation': return data.map(log => log["Program Expla"])
        case 'closingSkills': return data.map(log => log["Closing Skill"])
        case 'overallEffectiveness': return data.map(log => log["Overall Effecti"])
        default: return data.map(log => log["Overall Effecti"])
      }
    }

    chart.data.datasets[0].data = getData(selectedOption).reverse()
    chart.update()
  }

  function getColorForScore(score: number) {
    if (score >= 4) return '#00BFFF'
    if (score >= 3) return '#32CD32'
    if (score >= 2) return '#FFA500'
    return '#FF0000'
  }

  return (
    <>
      <Head>
        <title>Call Logs Dashboard</title>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" 
        />
      </Head>

      <div className="min-h-screen bg-[#111111] text-white">
        <div className="max-w-[800px] mx-auto my-5 bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
          <main className="p-5">
            <h2 className="text-5xl font-bold text-center mb-5">CALL SUMMARY</h2>
            
            <div className="bg-[#2a2a2a] border border-[#333333] rounded-lg p-5 mb-5 h-[350px] relative shadow-md">
              <select 
                className="w-full p-3 mb-4 text-base bg-[#2a2a2a] border border-[#444] rounded-md text-white appearance-none cursor-pointer hover:border-[#666]"
                onChange={(e) => updateChart(e.target.value)}
                style={{
                  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="292.4" height="292.4"><path fill="%23FFFFFF" d="M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z"/></svg>'
                  )}')`
                }}
              >
                <option value="overall">Overall overview of the average rating</option>
                <option value="engagement">Engagement</option>
                <option value="objectionHandling">Objection Handling</option>
                <option value="informationGathering">Information Gathering</option>
                <option value="programExplanation">Program Explanation</option>
                <option value="closingSkills">Closing Skills</option>
                <option value="overallEffectiveness">Overall Effectiveness</option>
              </select>
              <canvas id="progressChart"></canvas>
            </div>

            <div className="flex flex-col gap-4">
              {data.map((log, index) => (
                <div key={log.id} className="bg-[#2a2a2a] border border-[#333333] rounded-md p-4 transition-all hover:shadow-lg">
                  <div className="flex flex-col items-center mb-5">
                    <span className="text-2xl font-bold mb-2">CALL NUMBER {index + 1}</span>
                    <span className="text-sm text-gray-300 mb-1">{log["AI assistant"]}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Engagement", value: log["Engagement"] },
                      { label: "Objection Handling", value: log["Objection Hand"] },
                      { label: "Information Gathering", value: log["Information G"] },
                      { label: "Program Explanation", value: log["Program Expla"] },
                      { label: "Closing Skills", value: log["Closing Skill"] },
                      { label: "Overall Effectiveness", value: log["Overall Effecti"] }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#2a2a2a] border border-[#333333] rounded p-3 text-center cursor-pointer hover:bg-[#3a3a3a]">
                        <div className="text-sm font-bold mb-1">{stat.label}</div>
                        <div className="text-lg font-bold mb-1">{stat.value}/5</div>
                        <div className="h-1 bg-[#444] rounded overflow-hidden">
                          <div 
                            className="h-full rounded transition-all duration-300" 
                            style={{ 
                              width: `${(stat.value/5)*100}%`,
                              backgroundColor: getColorForScore(stat.value)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <div 
                      className="flex-1 p-3 rounded text-center cursor-pointer transition-colors duration-300"
                      style={{ backgroundColor: getColorForScore(log["Overall Effecti"]) }}
                    >
                      <span>Average Success: </span>
                      <span className="text-lg font-bold">{log["Overall Effecti"]}/5</span>
                    </div>
                    {log["recording URL"] && (
                      <button className="flex-1 bg-[#228ef1] hover:bg-[#1c7ad9] rounded flex items-center justify-center gap-2 text-white transition-colors duration-300">
                        <i className="fas fa-play"></i>
                        <a 
                          href={log["recording URL"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white"
                        >
                          Play Call
                        </a>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
