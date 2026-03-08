"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Basic",
        price: "1,999",
        features: ["Access to gym floor", "Standard equipment", "Locker access"],
        active: false,
    },
    {
        name: "Pro",
        price: "3,999",
        features: [
            "Everything in Basic",
            "Group classes",
            "1 Personal training/mo",
            "Nutrition guidance",
        ],
        active: true,
        popular: true,
    },
    {
        name: "Elite",
        price: "6,999",
        features: [
            "Everything in Pro",
            "Unlimited personal training",
            "Recovery suite access",
            "Priority booking",
        ],
        active: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 md:py-40 px-6 md:px-12 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4 block">
                        Membership
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                        Choose Your Plan
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative p-8 rounded-2xl glass transition-all duration-500 hover:scale-105",
                                plan.active ? "border-primary/50 py-12 bg-primary/5" : "hover:border-white/20"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₹{plan.price}</span>
                                    <span className="text-muted text-sm italic">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                            <Check size={12} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={cn(
                                    "w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                                    plan.active
                                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                                        : "border border-white/10 hover:bg-white/5"
                                )}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
