import { z } from 'zod';

export const TabInfoSchema = z.object({
	url: z.string(),
	pinned: z.boolean().optional(),
	muted: z.boolean().optional()
});

export const WindowInfoSchema = z.object({
	name: z.string().optional(),
	color: z.string().optional(),
	tabs: z.array(TabInfoSchema)
});

export type TabInfo = z.infer<typeof TabInfoSchema>;
export type WindowInfo = z.infer<typeof WindowInfoSchema>;
export const WindowInfoArraySchema = z.array(WindowInfoSchema);
