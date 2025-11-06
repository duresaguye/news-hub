'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function SubscriptionPanel() {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      description: "Basic access to news",
      features: ["Browse latest articles", "Limited searches per day", "Basic categories", "Community access"],
      current: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "9",
      description: "Professional news reader",
      features: [
        "Everything in Free",
        "Unlimited searches",
        "All categories",
        "Save articles",
        "Custom notifications",
        "Ad-free reading",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "19",
      description: "Complete news experience",
      features: [
        "Everything in Pro",
        "Breaking news alerts",
        "Exclusive analysis",
        "Early article access",
        "Priority support",
        "Export articles",
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary/15 to-accent/20 px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary font-semibold">Current plan</p>
              <p className="text-2xl font-bold text-foreground">Free</p>
              <p className="text-sm text-muted-foreground">Unlimited access to basic features</p>
            </div>
            <Button variant="outline" disabled>
              Current Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">Upgrade Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`${plan.id === 'premium' ? 'border-primary shadow-lg shadow-primary/10' : ''} relative overflow-hidden hover:shadow-md transition`}
            >
              {plan.id === 'premium' && (
                <div className="absolute right-3 top-3 rounded-full bg-primary/15 text-primary text-xs font-semibold px-2 py-1">Most popular</div>
              )}
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between gap-4">
                  <span>{plan.name}</span>
                  <span className="text-3xl font-bold text-foreground">${plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></span>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.current ? "outline" : plan.id === 'premium' ? "default" : "secondary"} disabled={plan.current}>
                  {plan.current ? "Current Plan" : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
