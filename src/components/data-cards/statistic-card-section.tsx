import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function StatisticSections() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 w-full max-w-screen-2xl mx-auto">
      <Card className="h-full bg-gradient-to-t from-primary/5 to-card dark:from-primary/10 dark:to-card shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="relative pb-2">
          <CardDescription className="text-sm font-normal text-muted-foreground">Total # Services</CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-normal tabular-nums mt-1">
            1,250
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2 border-t border-border/40">
          <div className="line-clamp-1 flex gap-2 font-normal">
            Trending up this month <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-muted-foreground">
            Number of Services for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="h-full bg-gradient-to-t from-primary/5 to-card dark:from-primary/10 dark:to-card shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="relative pb-2">
          <CardDescription className="text-sm font-normal text-muted-foreground">Visitors</CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-normal tabular-nums mt-1">
            11,234
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <TrendingUpIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2 border-t border-border/40">
          <div className="line-clamp-1 flex gap-2 font-normal">
            Trending down this month <TrendingDownIcon className="size-4 text-red-500" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="h-full bg-gradient-to-t from-primary/5 to-card dark:from-primary/10 dark:to-card shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="relative pb-2">
          <CardDescription className="text-sm font-normal text-muted-foreground">Active Accounts</CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-normal tabular-nums mt-1">
            45,678
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2 border-t border-border/40">
          <div className="line-clamp-1 flex gap-2 font-normal">
            Strong user retention <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="h-full bg-gradient-to-t from-primary/5 to-card dark:from-primary/10 dark:to-card shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="relative pb-2">
          <CardDescription className="text-sm font-normal text-muted-foreground">Growth Rate</CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-normal tabular-nums mt-1">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              <TrendingUpIcon className="size-3" />
              +1.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2 border-t border-border/40">
          <div className="line-clamp-1 flex gap-2 font-normal">
            Steady growth <TrendingUpIcon className="size-4 text-blue-500" />
          </div>
          <div className="text-muted-foreground">Year-over-year increase</div>
        </CardFooter>
      </Card>
    </div>
  )
}
