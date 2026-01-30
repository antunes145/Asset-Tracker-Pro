import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings as SettingsIcon, DollarSign, Clock, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Setting } from "@shared/schema";

export default function Settings() {
  const [prorateEnabled, setProrateEnabled] = useState(false);
  const [renewalAlert7, setRenewalAlert7] = useState(true);
  const [renewalAlert14, setRenewalAlert14] = useState(true);
  const [renewalAlert30, setRenewalAlert30] = useState(true);
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      const prorateSetting = settings.find((s) => s.key === "prorate_enabled");
      if (prorateSetting) {
        setProrateEnabled(prorateSetting.value === "true");
      }

      const alert7 = settings.find((s) => s.key === "renewal_alert_7_days");
      if (alert7) setRenewalAlert7(alert7.value === "true");

      const alert14 = settings.find((s) => s.key === "renewal_alert_14_days");
      if (alert14) setRenewalAlert14(alert14.value === "true");

      const alert30 = settings.find((s) => s.key === "renewal_alert_30_days");
      if (alert30) setRenewalAlert30(alert30.value === "true");
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: (data: { key: string; value: string }) =>
      apiRequest("POST", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Setting updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update setting", variant: "destructive" });
    },
  });

  const handleProrateToggle = (checked: boolean) => {
    setProrateEnabled(checked);
    updateSettingMutation.mutate({
      key: "prorate_enabled",
      value: checked.toString(),
    });
  };

  const handleRenewalAlert7 = (checked: boolean) => {
    setRenewalAlert7(checked);
    updateSettingMutation.mutate({
      key: "renewal_alert_7_days",
      value: checked.toString(),
    });
  };

  const handleRenewalAlert14 = (checked: boolean) => {
    setRenewalAlert14(checked);
    updateSettingMutation.mutate({
      key: "renewal_alert_14_days",
      value: checked.toString(),
    });
  };

  const handleRenewalAlert30 = (checked: boolean) => {
    setRenewalAlert30(checked);
    updateSettingMutation.mutate({
      key: "renewal_alert_30_days",
      value: checked.toString(),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your equipment rental tracking preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Cost Calculations</CardTitle>
            </div>
            <CardDescription>
              Configure how rental costs are calculated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prorate">Enable Prorating</Label>
                <p className="text-sm text-muted-foreground">
                  Prorate monthly costs for partial months
                </p>
              </div>
              <Switch
                id="prorate"
                checked={prorateEnabled}
                onCheckedChange={handleProrateToggle}
                disabled={updateSettingMutation.isPending}
                data-testid="switch-prorate"
              />
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">How prorating works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>When enabled, costs are calculated based on actual rental days</li>
                <li>A rental starting mid-month will be charged proportionally</li>
                <li>When disabled, full monthly rate is applied regardless of start date</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Renewal Alerts</CardTitle>
            </div>
            <CardDescription>
              Configure when to show renewal reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert-7">7 Days Before</Label>
                <p className="text-sm text-muted-foreground">
                  Show urgent alert
                </p>
              </div>
              <Switch
                id="alert-7"
                checked={renewalAlert7}
                onCheckedChange={handleRenewalAlert7}
                disabled={updateSettingMutation.isPending}
                data-testid="switch-alert-7"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert-14">14 Days Before</Label>
                <p className="text-sm text-muted-foreground">
                  Show warning alert
                </p>
              </div>
              <Switch
                id="alert-14"
                checked={renewalAlert14}
                onCheckedChange={handleRenewalAlert14}
                disabled={updateSettingMutation.isPending}
                data-testid="switch-alert-14"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert-30">30 Days Before</Label>
                <p className="text-sm text-muted-foreground">
                  Show early notice
                </p>
              </div>
              <Switch
                id="alert-30"
                checked={renewalAlert30}
                onCheckedChange={handleRenewalAlert30}
                disabled={updateSettingMutation.isPending}
                data-testid="switch-alert-30"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>User Roles</CardTitle>
            </div>
            <CardDescription>
              Understanding role permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-muted/50">
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-muted-foreground">
                  Full access to users, settings, projects, rentals, invoices, and reports
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="font-medium text-sm">Manager</p>
                <p className="text-xs text-muted-foreground">
                  Can manage projects, rentals, invoices, and view reports
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="font-medium text-sm">Viewer</p>
                <p className="text-xs text-muted-foreground">
                  Read-only access to all data except user management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Activity Log</CardTitle>
            </div>
            <CardDescription>
              Track changes made to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All changes to projects, rentals, and invoices are automatically logged
              with timestamps and user information.
            </p>
            <Button variant="outline" asChild>
              <a href="/api/activity-logs" target="_blank">View Activity Log</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle>About EquipTrack</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Version</p>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium">Database</p>
              <p className="text-sm text-muted-foreground">PostgreSQL</p>
            </div>
            <div>
              <p className="text-sm font-medium">Environment</p>
              <p className="text-sm text-muted-foreground">Production</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
