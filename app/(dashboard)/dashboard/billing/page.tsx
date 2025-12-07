"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Payment } from "@/lib/types"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Crown, Check, CreditCard, Calendar, IndianRupee, Loader2 } from "lucide-react"
import { format } from "date-fns"

declare global {
  interface Window {
    Razorpay: any
  }
}

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Get started with resume building",
    features: ["3 Resume templates", "Basic formatting", "Email support"],
    popular: false,
  },
  {
    name: "Premium",
    price: "₹99",
    period: "/month",
    description: "Unlock all premium features",
    features: [
      "All Basic features",
      "20+ Premium templates",
      "AI-powered suggestions",
      "Priority support",
      "Custom branding",
      "Unlimited resumes",
    ],
    popular: true,
  },
]

export default function BillingPage() {
  const { user, refreshUser } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.getPaymentHistory()
        setPayments(data)
      } catch (error) {
        console.error("Failed to fetch payment history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()

    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleUpgrade = async (planName: string) => {
    if (planName.toLowerCase() !== "premium") {
      return
    }

    setIsProcessing(true)
    try {
      // Create order on backend
      const order = await api.createPaymentOrder("premium")

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "RP Resume Builder",
        description: "Premium Plan Subscription",
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verification = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verification.status === "success") {
              toast.success("Payment successful! You are now a Premium user.")
              await refreshUser()
              // Refresh payment history
              const updatedPayments = await api.getPaymentHistory()
              setPayments(updatedPayments)
            } else {
              toast.error("Payment verification failed")
            }
          } catch (error) {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          email: user?.email || "",
          name: user?.name || "",
        },
        theme: {
          color: "#00ff88",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`)
      })
      razorpay.open()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create payment order")
    } finally {
      setIsProcessing(false)
    }
  }

  const currentPlan = user?.subscriptionPlan || "basic"

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Billing" description="Manage your subscription and payment history" />

      <div className="flex-1 p-6 space-y-8">
        {/* Current Plan */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold capitalize">{currentPlan}</h3>
                  {currentPlan !== "basic" && <Badge className="bg-primary text-primary-foreground">Active</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentPlan === "basic"
                    ? "You're on the free plan. Upgrade to unlock premium features."
                    : "Your subscription renews automatically."}
                </p>
              </div>
              {currentPlan !== "basic" && <Button variant="outline">Manage Subscription</Button>}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {plans.map((plan) => (
              <Card key={plan.name} className={`border-border relative ${plan.popular ? "border-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    disabled={currentPlan.toLowerCase() === plan.name.toLowerCase() || isProcessing}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {isProcessing && plan.name.toLowerCase() === "premium" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : currentPlan.toLowerCase() === plan.name.toLowerCase() ? (
                      "Current Plan"
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment History
            </CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No payment history yet</p>
                <p className="text-sm">Your transactions will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{payment.planType} Plan</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(payment.amount / 100).toFixed(2)}</p>
                      <Badge
                        variant={payment.status === "completed" ? "default" : "secondary"}
                        className={payment.status === "completed" ? "bg-green-500/10 text-green-500" : ""}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
