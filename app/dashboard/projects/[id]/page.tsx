"use client";

import React from "react";
import { useProject } from "@/app/hooks/useProjects";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  ArrowLeft,
  Users,
  ListTodo,
  CheckCircle2,
  Settings,
} from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams();

  const { data: project, isLoading, error } = useProject(id as string);

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error || !project) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load project.";

    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Card className="p-6 border border-red-200 bg-red-50 max-w-md">
          <p className="text-red-600 text-center font-semibold mb-4">
            {errorMessage}
          </p>

          <p className="text-sm text-center mb-4">
            Project ID: {id}
          </p>

          <Link href="/dashboard/projects">
            <Button variant="outline" className="w-full">
              Back to Projects
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ================= CALCULATIONS =================
  const totalTasks = project._count.tasks || 0;
  const completedTasks = project.tasks?.length || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // ================= UI =================
  return (
    <div className="p-6">
      {/* Back Button */}
      <Link href="/dashboard/projects">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: project.color || "#3b82f6" }}
            />
            <h1 className="text-3xl font-bold">{project.name}</h1>
          </div>

          {project.description && (
            <p className="text-gray-500">{project.description}</p>
          )}
        </div>

        <Link href={`/dashboard/projects/${id}/settings`}>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={<ListTodo />}
        />

        <StatCard
          title="Members"
          value={project._count.members}
          icon={<Users />}
        />

        <StatCard
          title="Completion"
          value={`${completionRate}%`}
          icon={<CheckCircle2 />}
        />
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ActionCard
          href={`/dashboard/projects/${id}/tasks`}
          title="Tasks"
          icon={<ListTodo />}
        />

        <ActionCard
          href={`/dashboard/projects/${id}/members`}
          title="Members"
          icon={<Users />}
        />

        <ActionCard
          href={`/dashboard/projects/${id}/settings`}
          title="Settings"
          icon={<Settings />}
        />
      </div>

      {/* Info */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Project Info</h2>

        <InfoRow label="Owner" value={project.owner.name} />
        <InfoRow label="Email" value={project.owner.email} />
        <InfoRow
          label="Created"
          value={new Date(project.createdAt).toLocaleDateString()}
        />
      </Card>
    </div>
  );
}

/* ================= COMPONENTS ================= */

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactElement;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <div className="text-blue-500 pt-1">
        {icon && React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}
      </div>
    </Card>
  );
}

interface ActionCardProps {
  href: string;
  title: string;
  icon?: React.ReactElement;
}

function ActionCard({ href, title, icon }: ActionCardProps) {
  return (
    <Link href={href}>
      <Card className="p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:shadow-lg hover:border-blue-500/50 transition-all group">
        <div className="text-blue-500 group-hover:scale-110 transition-transform">
          {icon && React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
      </Card>
    </Link>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between border-t pt-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}