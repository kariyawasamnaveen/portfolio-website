export const trackProjectView = (projectId) => {
  if (typeof window === 'undefined') return
  
  const viewed = JSON.parse(localStorage.getItem('viewedProjects') || '[]')
  if (!viewed.includes(projectId)) {
    viewed.push(projectId)
    localStorage.setItem('viewedProjects', JSON.stringify(viewed))
  }
}

export const getViewedProjects = () => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('viewedProjects') || '[]')
}

export const getSimilarProjects = (currentProject, allProjects) => {
  return allProjects
    .filter(p => p.id !== currentProject.id)
    .filter(p => p.tags.some(tag => currentProject.tags.includes(tag)))
    .slice(0, 3)
}