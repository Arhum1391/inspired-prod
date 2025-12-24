import { TeamMember } from '@/types/admin';

/**
 * Convert a name to a URL-friendly slug
 * @param name - The name to convert
 * @returns A URL-friendly slug
 */
export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
};

/**
 * Get the appropriate about text for a team member
 * @param member - The team member object
 * @param context - The context where the about text will be used
 * @returns The appropriate about text
 */
export const getTeamMemberAbout = (member: TeamMember, context: 'general' | 'bootcamp' = 'general'): string => {
  if (context === 'bootcamp' && member.bootcampAbout && member.bootcampAbout.trim()) {
    return member.bootcampAbout;
  }
  return member.about;
};

/**
 * Get team member by ID
 * @param members - Array of team members
 * @param id - The member ID to find
 * @returns The team member or undefined
 */
export const getTeamMemberById = (members: TeamMember[], id: number): TeamMember | undefined => {
  return members.find(member => member.id === id);
};

/**
 * Get team members by IDs
 * @param members - Array of team members
 * @param ids - Array of member IDs
 * @returns Array of matching team members
 */
export const getTeamMembersByIds = (members: TeamMember[], ids: number[]): TeamMember[] => {
  return members.filter(member => ids.includes(member.id));
};
