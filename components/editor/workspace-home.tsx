interface WorkspaceHomeProps {
  projectName: string
}

export function WorkspaceHome({ projectName }: WorkspaceHomeProps) {
  return (
    <div className="flex h-full min-h-full items-center justify-center px-6 py-12 text-center">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold tracking-normal text-copy-primary md:text-3xl">
          {projectName}
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted md:text-base">
          Workspace route is active. Canvas and collaboration features can mount here next.
        </p>
      </div>
    </div>
  )
}
