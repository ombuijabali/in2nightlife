from django_cron import CronJobBase, Schedule
from nightlif.management.commands.update_congestion import Command

class DjangoCronJob(CronJobBase):
    schedule = Schedule(run_every_mins=60)  # Run every 60 minutes
    code = 'nightlif.DjangoCronJob'  # A unique code for this cron job

    def do(self):
        # Run the update_congestion management command
        cmd = Command()
        cmd.handle()
