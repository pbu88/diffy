import {extendLifetime, isValidRawDiff, lifetimeExtensionCount, makeSharedDiff} from '../src/SharedDiff';

test('should create shared diff', () => {
  const raw_diff = `
diff --git a/file.json b/file.json
index 1456e89..e1da2da 100644
--- a/file.json
+++ b/file.json
@@ -1,1 +1,1 @@
-a
+b
`
  const date = new Date();
  let expire_date = new Date();
  expire_date.setDate(date.getDate() + 1);

  const shared_diff = makeSharedDiff(raw_diff, date);
  expect(shared_diff.created).toEqual(date);
  expect(shared_diff.expiresAt).toEqual(expire_date);
  expect(shared_diff.diff[0].newName).toEqual('file.json');
  expect(shared_diff.diff[0].oldName).toEqual('file.json');
  expect(shared_diff.rawDiff).toEqual(raw_diff);
});

test('should create shared diff with defaults', () => {
  const raw_diff = `
diff --git a/file.json b/file.json
index 1456e89..e1da2da 100644
--- a/file.json
+++ b/file.json
@@ -1,1 +1,1 @@
-a
+b
`
  const shared_diff = makeSharedDiff(raw_diff);
});

test('isValidRawDiff(): should validate a (valid) raw diff', () => {
  const raw_diff = `
diff --git a/file.json b/file.json
index 1456e89..e1da2da 100644
--- a/file.json
+++ b/file.json
@@ -1,1 +1,1 @@
-a
+b
`
  expect(isValidRawDiff(raw_diff)).toBe(true);
});

test('isValidRawDiff(): should fail validation when (invalid) raw diff', () => {
  const raw_diff = `
-a
+b
`
  expect(isValidRawDiff(raw_diff)).toBe(false);
});

test('lifetimeExtensionsCount()', () => {
  const raw_diff = `
diff --git a/file.json b/file.json
index 1456e89..e1da2da 100644
--- a/file.json
+++ b/file.json
@@ -1,1 +1,1 @@
-a
+b
`
  let sharedDiff = makeSharedDiff(raw_diff);
  expect(lifetimeExtensionCount(sharedDiff)).toEqual(0);

  // Extend it for a year a day at a time and test
  for(let i = 1; i <= 366; i++) {
    sharedDiff = extendLifetime(sharedDiff, 24)
    expect(lifetimeExtensionCount(sharedDiff)).toEqual(i);
  }
});