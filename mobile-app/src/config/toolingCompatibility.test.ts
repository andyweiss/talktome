import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const expoRequire = createRequire(require.resolve('expo/package.json'));
const cliRequire = createRequire(expoRequire.resolve('@expo/cli/package.json'));
const metroRequire = createRequire(expoRequire.resolve('@expo/metro/package.json'));
const xcodeRequire = createRequire(require.resolve('@bacons/xcode'));

describe('security-updated Expo tooling', () => {
  it('generates Xcode project IDs through the patched CommonJS UUID dependency', () => {
    const project = require('xcode').project('unused.pbxproj');
    project.hash = { project: { objects: {} } };
    const ids = Array.from({ length: 20 }, () => project.generateUuid());
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[A-F0-9]{24}$/);
  });

  it('round-trips Apple property lists through the Xcode plugin parser', () => {
    const plist = xcodeRequire('@expo/plist').default;
    const values = {
      CFBundleIdentifier: 'de.talktome.app',
      CFBundleVersion: '31',
      UIBackgroundModes: ['audio', 'bluetooth-central'],
      ITSAppUsesNonExemptEncryption: false,
      Label: 'Talktome & <Intercom>',
    };
    expect(plist.parse(plist.build(values))).toEqual(values);
  });

  it('reads bundled PNG dimensions through Metro', () => {
    const { getAssetSize } = metroRequire('metro/private/Assets');
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRzYAAAAASUVORK5CYII=',
      'base64',
    );
    expect(getAssetSize('png', png, 'pixel.png')).toMatchObject({ width: 1, height: 1 });
  });

  it('validates Expo dev-tool descriptors and output with the updated Zod', () => {
    const { PluginSchema, DevToolsPluginOutputSchema } = cliRequire(
      './build/src/start/server/DevToolsPlugin.schema.js',
    );
    expect(PluginSchema.safeParse({
      packageName: 'test-plugin',
      packageRoot: '/test-plugin',
      cliExtensions: {
        description: 'Test commands',
        commands: [{ name: 'level', title: 'Set level', environments: ['cli', 'mcp'] }],
        entryPoint: 'index.js',
      },
    }).success).toBe(true);
    expect(DevToolsPluginOutputSchema.safeParse([
      { type: 'text', text: 'Ready', level: 'info' },
    ]).success).toBe(true);
    expect(DevToolsPluginOutputSchema.safeParse([
      { type: 'text', text: 'Ready', level: 'invalid' },
    ]).success).toBe(false);
  });

  it('keeps MCP command validation and JSON schema generation compatible', () => {
    const { createMCPDevToolsExtensionSchema } = cliRequire(
      './build/src/start/server/createMCPDevToolsExtensionSchema.js',
    );
    const schema = createMCPDevToolsExtensionSchema({
      cliExtensions: {
        commands: [{
          name: 'level', title: 'Set level',
          parameters: [{ name: 'gain', type: 'number' }],
        }],
      },
    });
    expect(schema.parse({ command: 'level', gain: 0.5 })).toEqual({ command: 'level', gain: 0.5 });
    expect(schema.safeParse({ command: 'level', gain: 'invalid' }).success).toBe(false);
    expect(schema.safeParse({ command: 'unknown' }).success).toBe(false);
    expect(schema.safeParse({ command: 'level', extra: true }).success).toBe(false);
    expect(cliRequire('zod').toJSONSchema(schema)).toMatchObject({
      type: 'object', additionalProperties: false,
      properties: { command: { enum: ['level'] } },
    });
  });
});
