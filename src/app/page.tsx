import Link from "next/link";
import {
  Leaf,
  Shield,
  BarChart3,
  Search,
  Brain,
  Activity,
  ArrowRight,
  Globe,
  Building2,
  Landmark,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Leaf,
    title: "Create Project",
    description: "Register your environmental project with carbon impact claims and assessment objectives.",
  },
  {
    icon: Search,
    title: "Submit Evidence",
    description: "Add satellite imagery, reports, permits, and other public evidence URLs to support your claims.",
  },
  {
    icon: Brain,
    title: "AI Consensus Review",
    description: "GenLayer validators independently evaluate evidence using AI and reach decentralized consensus.",
  },
  {
    icon: BarChart3,
    title: "Confidence-Scored Assessment",
    description: "Receive a structured assessment with carbon estimates, risk levels, and confidence scores.",
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Carbon Impact Consensus",
    description: "Multi-validator AI assessment of carbon removal claims with confidence-scored estimates.",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description: "Automated detection of inconsistencies, fabricated evidence, and inflated claims.",
  },
  {
    icon: TreePine,
    title: "Biodiversity Intelligence",
    description: "Assess biodiversity impact alongside carbon metrics for holistic environmental evaluation.",
  },
  {
    icon: Search,
    title: "Evidence Registry",
    description: "Immutable on-chain registry of all evidence with integrity hashes and source attribution.",
  },
  {
    icon: Activity,
    title: "Confidence Scoring",
    description: "Granular 0-100 confidence scores across every assessment dimension, not binary pass/fail.",
  },
  {
    icon: Globe,
    title: "Continuous Monitoring",
    description: "Re-assess projects over time to track environmental progress and detect regression.",
  },
];

const audiences = [
  { icon: Building2, label: "Carbon Marketplaces" },
  { icon: Landmark, label: "ESG Funds" },
  { icon: Globe, label: "Governments & Regulators" },
  { icon: TreePine, label: "Conservation Projects" },
  { icon: Leaf, label: "Climate Startups" },
  { icon: Shield, label: "Environmental Auditors" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background px-4 py-24 sm:py-32">
        <div className="container mx-auto flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Leaf className="h-4 w-4 text-primary" />
            Powered by GenLayer AI Consensus
          </div>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Decentralized Environmental Intelligence &{" "}
            <span className="text-primary">Carbon Impact Consensus</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Transform uncertain environmental evidence into transparent, confidence-scored
            impact assessments using decentralized AI consensus.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">Explore Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b px-4 py-20">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Four steps from project submission to consensus-based environmental intelligence.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b px-4 py-20">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight">Core Capabilities</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Purpose-built for environmental intelligence, not generic token verification.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border bg-card/50">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b px-4 py-20">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight">Built For</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium shadow-sm"
              >
                <a.icon className="h-4 w-4 text-primary" />
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl rounded-2xl bg-primary/5 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Start Your First Assessment</h2>
            <p className="mt-4 text-muted-foreground">
              Connect your wallet and submit an environmental project for AI consensus evaluation.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/projects/new">
                Create Assessment Case
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
